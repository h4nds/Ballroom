# frozen_string_literal: true

class ForumBoard < ApplicationRecord
  has_many :forum_threads, dependent: :destroy

  validates :slug, presence: true, uniqueness: true, length: { maximum: 40 }
  validates :name, presence: true, length: { maximum: 120 }
  validates :description, length: { maximum: 300 }
end
