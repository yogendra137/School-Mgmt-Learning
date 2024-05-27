/** @format */
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
console.log('process.env.MAILTRAP_PASS', process.env.MAILTRAP_PASS);
const sendEmail = async (email: string, subject: string, payload: any, template: any) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS,
            },
        });
        const templatePath = path.join(__dirname, '../', template);

        const source = fs.readFileSync(templatePath, 'utf8');
        const compiledTemplate = handlebars.compile(source);
        const options = () => {
            return {
                from: process.env.ADMIN_EMAIL,
                to: email,
                subject,
                html: compiledTemplate(payload),
            };
        };

        // Send email
        await transporter.sendMail(options());
    } catch (error) {
        return error;
    }
};

export default sendEmail;
