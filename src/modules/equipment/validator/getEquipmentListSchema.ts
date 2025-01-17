import { orderEnum } from "@shared/types/pagination.type";
import { checkSchema } from "express-validator";
import {
  equipmentColumnArray,
  equipmentFilterTypeArray,
} from "../constants/paramsType";

export const getEquipmentListSchema = checkSchema({
  page: {
    optional: true,
    isInt: {
      errorMessage: "Deve ser um número inteiro",
      bail: true,
    },
    custom: {
      options: (value) => value > 0,
      errorMessage: "O número deve ser maior que zero",
    },
  },
  limit: {
    optional: true,
    isInt: {
      errorMessage: "Deve ser um número inteiro",
      bail: true,
    },
    custom: {
      options: (value) => value > 0,
      errorMessage: "O número deve ser maior que zero",
    },
  },
  order: {
    optional: true,
    isString: {
      errorMessage: "Deve ser do tipo string",
      bail: true,
    },
    isIn: {
      options: [[orderEnum.ASC, orderEnum.DESC]],
      errorMessage: "Tipo de ordenação inválido, escolha entre 'asc' ou 'desc'",
    },
  },
  column: {
    optional: true,
    isString: {
      errorMessage: "Deve ser do tipo string",
      bail: true,
    },
    isIn: {
      options: [equipmentColumnArray],
      errorMessage:
        "Nome de coluna inválida, escolha entre os campos retornados na lista de equipamentos",
    },
  },
  filter: {
    optional: true,
    isString: {
      errorMessage: "Deve ser do tipo string",
      bail: true,
    },
    isIn: {
      options: [equipmentFilterTypeArray],
      errorMessage: `Nome do filtro inválido, escolha entre os seguintes valores: ${equipmentFilterTypeArray.reduce(
        (ac: string, el: string) => (el ? `${ac}, ${el}` : `${ac}`)
      )}`,
    },
  },
  customerId: {
    notEmpty: true,
    optional: false,
    isInt: {
      errorMessage: "Deve ser um número inteiro",
      bail: true,
    },
    custom: {
      options: (value) => value > 0,
      errorMessage: "O número deve ser maior que zero",
    },
  },
});
