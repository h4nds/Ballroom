# frozen_string_literal: true

class Post < ApplicationRecord
  # Keep aligned with board ids in `src/data/forumData.ts`
  BOARD_SLUGS = %w[visual motion music writing tools critique collabs].freeze

  belongs_to :user

  validates :board_slug, presence: true, inclusion: { in: BOARD_SLUGS }
  validates :title, presence: true, length: { maximum: 200 }
  validates :body, presence: true, length: { maximum: 20_000 }
end
