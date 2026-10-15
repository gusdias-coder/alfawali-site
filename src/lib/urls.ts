import { company } from '../data/company';
import { whatsappLink } from './quote';
export const path = (value = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${value.replace(/^\//, '')}`;
export const contact = (message = 'Olá! Gostaria de conversar sobre os produtos e serviços da ALFAWALI.') => whatsappLink(company.whatsapp, message);
export const catalogContact = contact('Olá! Gostaria de receber o catálogo de produtos da ALFAWALI.');
