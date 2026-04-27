# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api, defaults: { format: :json } do
    get "bootstrap", to: "bootstrap#show"
    get "health", to: "health#show"
    post "echo", to: "echo#create"
    get "me", to: "me#show"
    patch "me", to: "me#update"
    patch "me/password", to: "me#update_password"
    get "users", to: "users#index"
    get "users/:username", to: "users#show"
    post "users/:username/follow", to: "follows#create"
    delete "users/:username/follow", to: "follows#destroy"
    post "auth/sign_up", to: "auth#sign_up"
    post "auth/sign_in", to: "auth#sign_in"
    delete "auth/sign_out", to: "auth#sign_out"
    resources :posts, only: %i[index create]
    get "boards", to: "forum_boards#index"
    get "boards/:slug", to: "forum_boards#show"
    post "boards/:board_slug/threads", to: "forum_threads#create"
    get "threads/:id", to: "forum_threads#show"
    post "threads/:id/posts", to: "forum_threads#create_post"
  end
end
