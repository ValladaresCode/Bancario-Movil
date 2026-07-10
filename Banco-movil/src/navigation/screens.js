import { withErrorBoundary } from '../shared/components';

import { DashboardScreen } from '../features/accounts/screens/DashboardScreen';
import { AccountsScreen } from '../features/accounts/screens/AccountsScreen';
import { AccountDetailScreen } from '../features/accounts/screens/AccountDetailScreen';
import { RequestAccountScreen } from '../features/accounts/screens/RequestAccountScreen';
import { TransactionsScreen } from '../features/transactions/screens/TransactionsScreen';
import { NewTransactionScreen } from '../features/transactions/screens/NewTransactionScreen';
import { ServicesScreen } from '../features/services/screens/ServicesScreen';
import { ServiceDetailScreen } from '../features/services/screens/ServiceDetailScreen';
import { PromotionsScreen } from '../features/promotions/screens/PromotionsScreen';
import { PromotionDetailScreen } from '../features/promotions/screens/PromotionDetailScreen';
import { ProfileScreen } from '../features/profile/screens/ProfileScreen';
import { EditProfileScreen } from '../features/profile/screens/EditProfileScreen';
import { FavoritesScreen } from '../features/favorites/screens/FavoritesScreen';
import { TransferToFavoriteScreen } from '../features/favorites/screens/TransferToFavoriteScreen';
import { CurrenciesScreen } from '../features/currencies/screens/CurrenciesScreen';
import { ChatListScreen } from '../features/chatbot/screens/ChatListScreen';
import { ChatScreen } from '../features/chatbot/screens/ChatScreen';

// Cada pantalla envuelta en ErrorBoundary: un error de render muestra un fallback
// con "Reintentar" en lugar de dejar la página totalmente en blanco.
export const S = {
  Dashboard: withErrorBoundary(DashboardScreen),
  Accounts: withErrorBoundary(AccountsScreen),
  AccountDetail: withErrorBoundary(AccountDetailScreen),
  RequestAccount: withErrorBoundary(RequestAccountScreen),
  Transactions: withErrorBoundary(TransactionsScreen),
  NewTransaction: withErrorBoundary(NewTransactionScreen),
  Services: withErrorBoundary(ServicesScreen),
  ServiceDetail: withErrorBoundary(ServiceDetailScreen),
  Promotions: withErrorBoundary(PromotionsScreen),
  PromotionDetail: withErrorBoundary(PromotionDetailScreen),
  Profile: withErrorBoundary(ProfileScreen),
  EditProfile: withErrorBoundary(EditProfileScreen),
  Favorites: withErrorBoundary(FavoritesScreen),
  TransferToFavorite: withErrorBoundary(TransferToFavoriteScreen),
  Currencies: withErrorBoundary(CurrenciesScreen),
  ChatList: withErrorBoundary(ChatListScreen),
  Chat: withErrorBoundary(ChatScreen),
};
