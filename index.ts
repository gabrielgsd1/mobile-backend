import { PrismaClient } from "@prisma/client";
import { Application } from "express";
import { RegisterUserCredentials, UserCredentials } from "./types";

const prisma = new PrismaClient();

const express = require("express");

const app: Application = express();

app.use(express.json());

app.get("/", async (_, res) => {
  const json = await prisma.mobileUsers.findMany();
  res.json(json);
});

app.post("/registerUser", async (req, res) => {
  if (!req.body)
    return res.json({ error: true, message: "Preencha todas as informações!" });
  const { name, email, password }: RegisterUserCredentials = req.body;
  if (!email || !password || !name) {
    return res.json({ error: true, message: "Preencha todas as informações!" });
  }
  const createdUser = await prisma.mobileUsers.create({
    data: { name, email, password },
  });
  return res.json(createdUser);
});

app.post("/checkForUser", async (req, res) => {
  const { email, password }: UserCredentials = req.body;
  if (!email || !password) {
    return res.json({ error: true, message: "Preencha todas as informações!" });
  }
  const user = await prisma.mobileUsers.findUnique({ where: { email } });
  if (!user || password != user.password) {
    return res.json({ error: true, message: "Informações inválidas" });
  }
  return res.json({ message: "ok" });
});

app.post("/saveResult/:id", async (req, res) => {
  const { id } = req.params;
  const { requestUrl, carName, carYear, carBrand } = req.body;
  const createdUrl = await prisma.carData.create({
    data: { userId: id, url: requestUrl, carName, carYear, carBrand },
  });
  return res.json({ message: "ok", data: createdUrl });
});

app.get("/getPreviousSearches/:id", async (req, res) => {
  const { id } = req.params;
  const previousSearches = await prisma.carData.findMany({
    where: { userId: id },
  });
  return res.json(previousSearches);
});

app.listen(3000, async () => {
  await prisma.$connect();
});
