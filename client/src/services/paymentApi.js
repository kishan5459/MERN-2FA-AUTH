import api from "./api"

export const checkoutBasic = async () => {
  return await api.post(
    "/payment/stripe/checkout/basic", {}, {
      withCredentials: true
    }
  )
}

export const checkoutAnnual = async () => {
  return await api.post(
    "/payment/stripe/checkout/annual", {}, {
      withCredentials: true
    }
  )
}

export const checkoutNewsletter = async (email) => {
  return await api.post(
    "/payment/stripe/checkout/newsletter", {
      email
    }, {
      withCredentials: true
    }
  )
}