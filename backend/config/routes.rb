# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api, defaults: { format: :json } do
    get "bootstrap", to: "bootstrap#show"
    get "health", to: "health#show"
    post "echo", to: "echo#create"
    get "me", to: "me#show"
    patch "me", to: "me#update"
    post "auth/sign_up", to: "auth#sign_up"
    post "auth/sign_in", to: "auth#sign_in"
    delete "auth/sign_out", to: "auth#sign_out"
  end
end
