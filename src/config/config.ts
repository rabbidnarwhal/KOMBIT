export class Config {
  public static API_URL: string = 'http://kombit.org/api';
  public static GOOGLE_MAP_API_KEY: string = 'AIzaSyCNX9Xn6WmecGQAKS9sclNlkqmtwZOZzk8';
  public static CURRENCY: string = 'RP';

  public static setCurrency(currency) {
    this.CURRENCY = currency;
  }
}
