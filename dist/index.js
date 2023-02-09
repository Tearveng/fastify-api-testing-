"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const cors_1 = __importDefault(require("@fastify/cors"));
const google_libphonenumber_1 = __importDefault(require("google-libphonenumber"));
const prisma = new client_1.PrismaClient();
const app = (0, fastify_1.default)();
const val = google_libphonenumber_1.default.PhoneNumberUtil.getInstance();
app.register(cookie_1.default);
app.register(cors_1.default, {
    origin: 'http://localhost:3000',
    credentials: true
});
app.route({
    method: "POST",
    url: "/api/user/upload",
    handler: async (req, res) => {
        const { first, last, email, password, phone } = req.body;
        const hasEmail = email.toLowerCase();
        const hashPassword = await bcrypt_1.default.hash(password, 10);
        const user = await prisma.user.create({ data: {
                first,
                last,
                email: hasEmail,
                password: hashPassword,
                phone
            } });
        if (!user)
            throw new Error("Something went wrong");
        return res.send({
            id: user.id,
            username: `${user.first} ${user.last}`,
            email: user.email
        });
    }
});
app.get('/api/users', async (req, res) => {
    const users = await prisma.user.findMany();
    return res.send(users);
});
app.post('/api/user/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
        throw new Error("User not found.");
    const hashPassword = await bcrypt_1.default.hash(password, user.password);
    if (!hashPassword)
        throw new Error("Incorrect password.");
    return res.send({
        id: user.id,
        email: user.email,
        username: `${user.first} ${user.last}`
    });
});
app.get("/api/validate/phone", async (req, res) => {
    const number = val.parseAndKeepRawInput("0883608265", 'KH');
    const code = number.getCountryCode();
    const nationalNumber = number.getNationalNumber();
    const extension = number.getExtension();
    const numberaw = number.getRawInput();
    const validateLength = val.isPossibleNumber(number);
    const validatePhone = val.isValidNumber(number);
    const validatePhoneRegion = val.isValidNumberForRegion(number, 'KH');
    return res.send({
        code,
        nationalNumber,
        extension,
        numberaw,
        validateLength,
        validatePhone,
        validatePhoneRegion
    });
});
app.listen({ port: 5000 }, function (err, address) {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    // Server is now listening on ${address}
    console.log(`Server is now listening on ${address}`);
});
