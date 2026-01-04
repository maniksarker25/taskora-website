import { configureStore } from '@reduxjs/toolkit';
import authApi from './features/auth/authApi';
import authentication from './features/authentication/authentication';
import authReducer from './features/auth/authSlice';
import categoryApi from './features/category/categoryApi';
import taskApi from './features/task/taskApi';
import serviceApi from './features/service/serviceApi';
import bidApi from './features/bidApi/bidApi';
import questionApi from './features/question/questionApi';
import cancellationApi from './features/cancelApi/cancellationApi';
import providerServiceApi from './features/providerService/providerServiceApi';
import { chatApi } from './features/chatApi/chatApi';
import extensionApi from './features/extensionApi/extensionApi';
import fileApi from './features/fileApi/fileApi';
import feedbackApi from './features/feedback/feedbackApi';
import notificationApi from './features/notification/notificationApi';
import { transactionApi } from './features/transactionApi/transactionApi';
import bankVerificationApi from './features/bankVerificationApi/bankVerificationApi';
import faqApi from './features/web/faqApi';
import termsApi from './features/web/termsApi';
import privacyApi from './features/web/privacyApi';
import promoApi from './features/promo/promoApi';

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      [authApi.reducerPath]: authApi.reducer,
      [authentication.reducerPath]: authentication.reducer,
      [categoryApi.reducerPath]: categoryApi.reducer,
      [taskApi.reducerPath]: taskApi.reducer,
      [serviceApi.reducerPath]: serviceApi.reducer,
      [bidApi.reducerPath]: bidApi.reducer,
      [questionApi.reducerPath]: questionApi.reducer,
      [cancellationApi.reducerPath]: cancellationApi.reducer,
      [providerServiceApi.reducerPath]: providerServiceApi.reducer,
      [chatApi.reducerPath]: chatApi.reducer,
      [extensionApi.reducerPath]: extensionApi.reducer,
      [fileApi.reducerPath]: fileApi.reducer,
      [feedbackApi.reducerPath]: feedbackApi.reducer,
      [notificationApi.reducerPath]: notificationApi.reducer,
      [transactionApi.reducerPath]: transactionApi.reducer,
      [bankVerificationApi.reducerPath]: bankVerificationApi.reducer,
      [faqApi.reducerPath]: faqApi.reducer,
      [termsApi.reducerPath]: termsApi.reducer,
      [privacyApi.reducerPath]: privacyApi.reducer,
      [promoApi.reducerPath]: promoApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
      .concat(
        authApi.middleware,
        authentication.middleware,
        categoryApi.middleware,
        taskApi.middleware,
        serviceApi.middleware,
        bidApi.middleware,
        questionApi.middleware,
        cancellationApi.middleware,
        providerServiceApi.middleware,
        chatApi.middleware,
        extensionApi.middleware,
        fileApi.middleware,
        feedbackApi.middleware,
        notificationApi.middleware,
        transactionApi.middleware,
        bankVerificationApi.middleware,
        faqApi.middleware,
        termsApi.middleware,
        privacyApi.middleware,
        promoApi.middleware,
      ),
    devTools: process.env.NODE_ENV !== 'production',
  });

export const store = makeStore();

export const getStoreState = () => store.getState();
export const getStoreDispatch = () => store.dispatch;

export default store;

