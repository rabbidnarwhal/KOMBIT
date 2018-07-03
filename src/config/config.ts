export class Config {
  public static API_URL: string = 'http://kombit.org/api';
  // public static API_URL: string = 'http://192.168.1.7:9000/api';
  public static GOOGLE_MAP_API_KEY: string = 'AIzaSyCNX9Xn6WmecGQAKS9sclNlkqmtwZOZzk8';
  public static CURRENCY: string = 'RP';

  public static setCurrency(currency) {
    this.CURRENCY = currency;
  }
}
