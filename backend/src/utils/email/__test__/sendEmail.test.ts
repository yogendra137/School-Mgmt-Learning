import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import sendEmail from '../sendEmail';

jest.mock('fs');
jest.mock('handlebars');

describe('sendEmail', () => {
    const email = 'test@example.com';
    const subject = 'Test Subject';
    const payload = { name: 'Test User' };
    const template = 'testTemplate.hbs';

    let mockTransporter: any;

    beforeEach(() => {
        mockTransporter = {
            sendMail: jest.fn(),
        };
        jest.spyOn(nodemailer, 'createTransport').mockReturnValue(mockTransporter);
        (fs.readFileSync as jest.Mock).mockReturnValue('<html><body><p>{{name}}</p></body></html>');
        (handlebars.compile as jest.Mock).mockReturnValue(() => '<html><body><p>Test User</p></body></html>');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should send an email successfully', async () => {
        mockTransporter.sendMail.mockResolvedValue('Email sent');

        const result = await sendEmail(email, subject, payload, template);

        expect(fs.readFileSync).toHaveBeenCalledWith(expect.stringContaining(template), 'utf8');
        expect(handlebars.compile).toHaveBeenCalledWith('<html><body><p>{{name}}</p></body></html>');
        expect(mockTransporter.sendMail).toHaveBeenCalledWith({
            from: process.env.ADMIN_EMAIL,
            to: email,
            subject,
            html: '<html><body><p>Test User</p></body></html>',
        });
        expect(result).toBeUndefined(); // Since the function doesn't return anything on success
    });

    it('should handle errors', async () => {
        const errorMessage = 'Error sending email';
        mockTransporter.sendMail.mockRejectedValue(new Error(errorMessage));

        const result = await sendEmail(email, subject, payload, template);

        expect(result).toBeInstanceOf(Error);
        // expect(result.message).toBe(errorMessage);
    });
});
