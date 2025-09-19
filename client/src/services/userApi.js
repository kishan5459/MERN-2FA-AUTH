import api from "./api"

export const getMySessions = async () => {
  return await api.get("/user/my-sessions", { withCredentials: true })
}

export const deleteMySession = async (sessionId) => {
  return await api.delete(`/user/my-sessions/${sessionId}`, { withCredentials: true })
}

export const getMyPayments = async () => {
  return await api.get("/user/my-payments", { withCredentials: true })
}

export const cancelSubscription = async (subscriptionId) => {
  return await api.delete(`/user/my-payments/${subscriptionId}`, { withCredentials: true })
}

export const getMe = async () => {
  return await api.get("/user/me", { withCredentials: true })
}