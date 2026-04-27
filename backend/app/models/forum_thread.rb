# frozen_string_literal: true

class ForumThread < ApplicationRecord
  belongs_to :forum_board
  belongs_to :user
  has_many :forum_posts, dependent: :destroy

  validates :subject, presence: true, length: { maximum: 200 }
  validates :body, presence: true, length: { maximum: 20_000 }
  validates :bumped_at, presence: true

  before_validation :set_default_bumped_at, on: :create

  private

  def set_default_bumped_at
    self.bumped_at ||= Time.current
  end
end
