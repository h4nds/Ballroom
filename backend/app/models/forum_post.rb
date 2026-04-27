# frozen_string_literal: true

class ForumPost < ApplicationRecord
  belongs_to :forum_thread
  belongs_to :user

  validates :body, presence: true, length: { maximum: 20_000 }

  after_commit :touch_thread_bump, on: :create

  private

  def touch_thread_bump
    forum_thread.update_column(:bumped_at, created_at) # rubocop:disable Rails/SkipsModelValidations
  end
end
