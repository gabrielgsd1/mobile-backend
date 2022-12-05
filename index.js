"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const express = require("express");
const app = express();
app.use(express.json());
app.get("/", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const json = yield prisma.mobileUsers.findMany();
    res.json(json);
}));
app.post("/registerUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body)
        return res.json({ error: true, message: "Preencha todas as informações!" });
    console.log(req.body);
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
        return res.json({ error: true, message: "Preencha todas as informações!" });
    }
    const createdUser = yield prisma.mobileUsers.create({
        data: { name, email, password },
    });
    return res.json(createdUser);
}));
app.post("/checkForUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ error: true, message: "Preencha todas as informações!" });
    }
    const user = yield prisma.mobileUsers.findUnique({ where: { email } });
    if (!user || password != user.password) {
        return res.json({ error: true, message: "Informações inválidas" });
    }
    return res.json({ message: "ok" });
}));
app.post("/saveResult/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { requestUrl, carName, carYear, carBrand } = req.body;
    const createdUrl = yield prisma.carData.create({
        data: { userId: id, url: requestUrl, carName, carYear, carBrand },
    });
    return res.json({ message: "ok", data: createdUrl });
}));
app.get("/getPreviousSearches/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const previousSearches = yield prisma.carData.findMany({
        where: { userId: id },
    });
    return res.json(previousSearches);
}));
app.listen(3000, () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$connect();
    console.log("okay");
}));
