interface IValidationReserve {
  idBroker: string;
  duration: number;
  date: Date;
}

interface IResponseValidationReserve {
  valid: boolean;
  message?: string;
}
