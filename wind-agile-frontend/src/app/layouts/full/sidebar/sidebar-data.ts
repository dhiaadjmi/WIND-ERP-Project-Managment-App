import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: ' ',
  },
  {
    displayName: 'Tableau de bord',
    iconName: 'chart-histogram',
    route: '/component/admindashboard',
   roles: ['ADMIN']
  },

  {
    displayName: 'Liste des Entreprises',
    iconName: 'building-skyscraper',
    route: '/component/companies',
   roles: ['ADMIN']
  },
  {
    displayName: 'Accueil',
    iconName: 'home',
    route: '/component/companydashboard',
    roles: ['COMPANY']
  },

  {
    displayName: 'Nos Personnels',
    iconName: 'users',
    route: '/component/users',
    roles: ['COMPANY']
  },
  {
    displayName: 'Nos Equipes',
    iconName: 'users-group',
    route: '/component/teams',
    roles: ['COMPANY']
  },
  {
    displayName: 'Nos Projets',
    iconName: 'businessplan',
    route: '/component/projects',
    roles: ['COMPANY']
  },


  {
    displayName: 'Accueil',
    iconName: 'home',
    route: '/component/myhomepage',
    roles: ['EMPLOYEE', 'LEADER']
  },

  {
    displayName: 'Mes tâches',
    iconName: 'checklist',
    route: '/component/mytasks',
    roles: ['EMPLOYEE','LEADER']
  },

  {
    displayName: 'Mes Équipes',
    iconName: 'users-group',
    route: '/component/myteams',
    roles: ['EMPLOYEE','LEADER']
  },


/**
  {
    navCap: 'Ui Components',
  },
  {
    displayName: 'Badge',
    iconName: 'rosette',
    route: '/ui-components/badge',
  },
  {
    displayName: 'Chips',
    iconName: 'poker-chip',
    route: '/ui-components/chips',
  },
  {
    displayName: 'Lists',
    iconName: 'list',
    route: '/ui-components/lists',
  },
  {
    displayName: 'Menu',
    iconName: 'layout-navbar-expand',
    route: '/ui-components/menu',
  },
  {
    displayName: 'Tooltips',
    iconName: 'tooltip',
    route: '/ui-components/tooltips',
  },
  {
    navCap: 'Auth',
  },
  {
    displayName: 'Login',
    iconName: 'lock',
    route: '/authentication/login',
  },
  {
    displayName: 'Register',
    iconName: 'user-plus',
    route: '/authentication/register',
  },
  {
    navCap: 'Extra',
  },
  {
    displayName: 'Icons',
    iconName: 'mood-smile',
    route: '/extra/icons',
  },
  {
    displayName: 'Sample Page',
    iconName: 'aperture',
    route: '/extra/sample-page',
  },
*/
];
