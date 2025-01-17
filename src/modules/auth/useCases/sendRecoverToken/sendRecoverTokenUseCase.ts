import "dotenv/config";
import jwt from "jsonwebtoken";
import { prisma } from "@prismaClient/client";

import { SendRecoverTokenRequestDTO } from "@modules/auth/dtos/sendRecoverToken/SendRecoverTokenRequestDTO";
import { SendRecoverTokenResponseDTO } from "@modules/auth/dtos/sendRecoverToken/SendRecoverTokenResponseDTO";

import { sendEmail } from "@services/Nodemailer";
import { mailConfig } from "@config/nodemailer";
import { generateRecoverTemplateWithData } from "@services/Nodemailer/templates/recoverMail";
import { badRequest, ok, serverError } from "@helper/http/httpHelper";
import { HttpResponse } from "@shared/protocols/http";

const secretKey = process.env.SECRET_KEY_JWT as jwt.Secret;
const recoverExpireTime = process.env.RECOVER_EXPIRE_TIME;
const emailUser = process.env.EMAIL_USER;

export class SendRecoverTokenUseCase {
  async execute({
    email,
  }: SendRecoverTokenRequestDTO): Promise<
    HttpResponse<SendRecoverTokenResponseDTO>
  > {
    const checkUserExistence = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!checkUserExistence) {
      return badRequest("E-mail inválido");
    }

    const recoverToken = jwt.sign({ id: checkUserExistence.id }, secretKey, {
      expiresIn: `${recoverExpireTime}`,
    });

    const result = await prisma.user.updateMany({
      where: {
        email,
      },
      data: {
        recoverToken,
      },
    });

    if (!result) {
      return badRequest("Erro no processo de recuperação de senha");
    }

    const renderedTemplate = generateRecoverTemplateWithData(recoverToken);

    try {
      await sendEmail(
        mailConfig({
          destination: email,
          from: emailUser || "recover@gos.com",
          subject: "Recuperação de senha - Sistema GOS",
          template: renderedTemplate,
        })
      );
    } catch (error) {
      return serverError(error);
    }

    return ok({
      message:
        "Token de segurança foi enviado ao e-mail informado, verifique sua caixa de entrada e spam",
    });
  }
}
