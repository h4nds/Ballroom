# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api, defaults: { format: :json } do
    get "bootstrap", to: "bootstrap#show"
    get "health", to: "health#show"
    post "echo", to: "echo#create"
  end
end
