export class AppError {
  message: string;
  constructor(message: string) {
    //ele é chamado no momento que a classe é instanciada
    this.message = message;
  }
}
