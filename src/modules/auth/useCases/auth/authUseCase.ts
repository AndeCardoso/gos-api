import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@prismaClient/client";
import { AuthRequestDTO } from "@modules/auth/dtos/auth/AuthRequestDTO";
import { AuthResponseDTO } from "@modules/auth/dtos/auth/AuthResponseDTO";
import { forbidden, ok, unauthorized } from "@helper/http/httpHelper";
import { HttpResponse } from "@shared/protocols/http";
import { companyStatusEnum } from "@modules/company/constants";
import { DAY_TRIAL_EXPIRATION } from "@config/access";
import { differenceInDays } from "date-fns";

const secretKey = process.env.SECRET_KEY_JWT as jwt.Secret;
const accessExpireTime = process.env.ACCESS_EXPIRE_TIME as jwt.Secret;

export class AuthUseCase {
  async execute({
    email,
    password,
  }: AuthRequestDTO): Promise<HttpResponse<AuthResponseDTO>> {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return unauthorized("E-mail ou senha inválida");
    }

    const match = await bcrypt.compare(password, user?.password);

    if (!match) {
      return unauthorized("E-mail ou senha inválida");
    }

    const company = await prisma.company.findFirst({
      where: {
        id: user.companyId,
      },
    });

    if (company?.status === companyStatusEnum.BLOCKED) {
      return forbidden(
        "Usuário bloqueado, entre em contato com o Sistema GOS para reativar sua conta"
      );
    }

    if (company?.status === companyStatusEnum.TRIAL) {
      if (
        differenceInDays(new Date(), new Date(company.created_at)) >
        DAY_TRIAL_EXPIRATION
      ) {
        await prisma.company.update({
          where: {
            id: company.id,
          },
          data: {
            status: companyStatusEnum.BLOCKED,
          },
        });
        return forbidden(
          "Licença gratuita encerrada, entre em contato com o Sistema GOS para reativar sua conta"
        );
      }
    }

    const userPayload = {
      companyId: company?.id,
      companyName: company?.name,
      id: user.id,
      name: user.name,
      email: user.email,
      admin: user.admin,
    };
    const token = jwt.sign({ userPayload }, secretKey, {
      expiresIn: `${accessExpireTime}`,
    });

    const response = {
      token,
    };

    return ok(response);
  }
}
