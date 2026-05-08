# frozen_string_literal: true

require "test_helper"

class ApiForumFlowTest < ActionDispatch::IntegrationTest
  setup do
    ForumBoard.find_or_create_by!(slug: "visual") do |b|
      b.name = "visual work"
      b.description = "test board"
    end
  end

  test "bootstrap returns csrf token" do
    get "/api/bootstrap"
    assert_response :success
    body = JSON.parse(response.body)
    assert_equal true, body["ok"]
    assert body["csrf_token"].present?
  end

  test "health endpoint" do
    get "/api/health"
    assert_response :success
  end

  test "boards index returns seeded board with zero counts" do
    get "/api/boards"
    assert_response :success
    boards = JSON.parse(response.body)["boards"]
    visual = boards.find { |b| b["slug"] == "visual" }
    assert visual
    assert_equal 0, visual["threadCount"]
    assert_equal 0, visual["postCount"]
  end

  test "sign up and create forum thread with csrf" do
    username = "user_#{SecureRandom.hex(4)}"
    csrf = fetch_csrf!

    post "/api/auth/sign_up",
      params: {
        username: username,
        display_name: "Flow User",
        password: "password12",
        password_confirmation: "password12",
      }.to_json,
      headers: api_json_headers(csrf)

    assert_response :created, response.body

    csrf = fetch_csrf!

    post "/api/boards/visual/threads",
      params: { subject: "Integration topic", body: "Body text for the thread." }.to_json,
      headers: api_json_headers(csrf)

    assert_response :created, response.body
    thread = JSON.parse(response.body)["thread"]
    assert_equal "Integration topic", thread["subject"]

    get "/api/boards/visual"
    assert_response :success
    payload = JSON.parse(response.body)
    assert_operator payload["threads"].size, :>=, 1
    row = payload["threads"].find { |t| t["subject"] == "Integration topic" }
    assert_equal 0, row["replyCount"]
  end

  private

  def fetch_csrf!
    get "/api/bootstrap"
    assert_response :success
    JSON.parse(response.body)["csrf_token"]
  end

  def api_json_headers(csrf)
    {
      "CONTENT_TYPE" => "application/json",
      "Accept" => "application/json",
      "X-CSRF-Token" => csrf,
    }
  end
end
