export class Config {
  public static API_URL: string = 'http://kombit.org/api';
  public static GOOGLE_MAP_API_KEY: string = 'AIzaSyCNX9Xn6WmecGQAKS9sclNlkqmtwZOZzk8';
  public static CURRENCY: string = 'RP';

  public static setCurrency(currency) {
    this.CURRENCY = currency;
  }

  public static SUPPLIER: { SIDEMENU: Array<any>; TABMENU: Array<any> } = {
    SIDEMENU: [
      { title: 'Notification', component: 'NotificationPage', icon: 'notifications', image: '' },
      { title: 'Appointment', component: 'AppointmentPage', icon: 'calendar', image: '' },
      { title: 'My Post', component: 'PostMyPage', icon: 'share', image: '' },
      { title: 'Company', component: 'company', icon: '', image: 'assets/imgs/company.png' },
      { title: 'Solution', component: 'SolutionPage', icon: '', image: 'assets/imgs/solution-menu.png' },
      { title: 'Setting', component: '', icon: 'settings', image: '' },
      { title: 'Point', component: '', icon: '', image: 'assets/imgs/points.png' },
      { title: 'Logout', component: 'logout', icon: 'log-out', image: '' }
    ],
    TABMENU: [
      { title: 'My Post', component: 'PostMyPage', icon: 'combit-my-post', image: 'assets/imgs/my-post.png' },
      { title: 'Favorite', component: 'FavoritePage', icon: 'combit-favorite', image: 'assets/imgs/favorite.png' },
      { title: 'New Post', component: 'PostNewPage', icon: 'combit-new-post', image: 'assets/imgs/new-post.png' },
      { title: 'Meeting', component: 'AppointmentPage', icon: 'combit-meeting', image: 'assets/imgs/meeting.png' },
      { title: 'User', component: 'ProfilePage', icon: 'combit-user', image: 'assets/imgs/user.png' }
    ]
  };

  public static CUSTOMER: { SIDEMENU: Array<any>; TABMENU: Array<any> } = {
    SIDEMENU: [
      { title: 'Notification', component: 'NotificationPage', icon: 'notifications', image: '' },
      { title: 'Appointment', component: 'AppointmentPage', icon: 'calendar', image: '' },
      { title: 'Company', component: 'company', icon: '', image: 'assets/imgs/company.png' },
      { title: 'Solution', component: 'SolutionPage', icon: '', image: 'assets/imgs/solution-menu.png' },
      { title: 'Setting', component: '', icon: 'settings', image: '' },
      { title: 'Point', component: '', icon: '', image: 'assets/imgs/points.png' },
      { title: 'Logout', component: 'logout', icon: 'log-out', image: '' }
    ],
    TABMENU: [
      { title: 'Chat', component: 'ChatPage', icon: 'combit-chat', image: 'assets/imgs/chat.png' },
      { title: 'Favorite', component: 'FavoritePage', icon: 'combit-favorite', image: 'assets/imgs/favorite.png' },
      { title: 'Home', component: 'HomePage', icon: 'combit-new-post', image: 'assets/imgs/my-post.png' },
      { title: 'Meeting', component: 'AppointmentPage', icon: 'combit-meeting', image: 'assets/imgs/meeting.png' },
      { title: 'User', component: 'ProfilePage', icon: 'combit-user', image: 'assets/imgs/user.png' }
    ]
  };
}
