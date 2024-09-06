import express from "express";

import { urlModel } from "../model/shortUrl";
import { nanoid } from "nanoid";

export const createUrl = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { fullUrl } = req.body;
    const urlFound = await urlModel.find({ fullUrl: fullUrl });
    if (urlFound.length > 0) {
      res.status(409);
      res.send(urlFound);
    } else {
      const shortUrl = await urlModel.create({ fullUrl });
      res.status(201).send(shortUrl);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "something went wrong" });
  }
};

export const getAllUrl = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const shortUrls = await urlModel.find({}).sort({ createdAt: -1 });
    if (shortUrls.length < 0) {
      res.status(404).send({ message: "urls not found" });
    } else {
      res.status(201).send({ shortUrls });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "something went wrong" });
  }
};

export const getUrl = async (req: express.Request, res: express.Response) => {
  try {
    const shortUrl = await urlModel.findOne({ shortUrl: req.params.id });
    if (!shortUrl) {
      res.status(404).send({ message: "url not found" });
    } else {
      shortUrl.clicks++;
      shortUrl.save();
      res.redirect(`${shortUrl.fullUrl}`);
    }
  } catch (err) {
    res.status(500).send({ message: "something went wrong" });
  }
};

export const deleteUrl = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const shortUrl = await urlModel.findByIdAndDelete({ _id: req.params.id });
    if (shortUrl) {
      res.status(200).send({ message: "url successfully deleted" });
    }
  } catch (err) {
    res.status(500).send({ message: "something went wrong" });
  }
};
