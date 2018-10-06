import request from '@/utils/request';

export default {
  call: { url: '/api/json/api', request },
  login: { url: '/api/json/user/login', db: 'TT' },
};
