# frozen_string_literal: true

class User < ApplicationRecord
  DISCIPLINES = %w[visual motion music writing general].freeze
  ACCENTS = %w[purple green yellow].freeze

  has_secure_password

  has_many :posts, dependent: :destroy
  has_many :forum_threads, dependent: :destroy
  has_many :forum_posts, dependent: :destroy
  has_many :active_follows, class_name: "Follow", foreign_key: :follower_id, inverse_of: :follower, dependent: :destroy
  has_many :passive_follows, class_name: "Follow", foreign_key: :following_id, inverse_of: :following, dependent: :destroy
  has_many :following_users, through: :active_follows, source: :following
  has_many :follower_users, through: :passive_follows, source: :follower

  before_validation :normalize_username
  before_validation :default_display_name

  validates :username, presence: true, length: { maximum: 32 }, uniqueness: { case_sensitive: false }
  validates :display_name, presence: true, length: { maximum: 48 }
  validates :password, length: { minimum: 8 }, if: -> { password.present? }
  validates :discipline, inclusion: { in: DISCIPLINES }
  validates :accent, inclusion: { in: ACCENTS }
  validates :bio, length: { maximum: 500 }

  def self.find_by_username_param!(raw)
    find_by!(username: raw.to_s.strip.downcase.gsub(/\s+/, "_"))
  end

  private

  def normalize_username
    return if username.blank?

    self.username = username.strip.downcase.gsub(/\s+/, "_")
  end

  def default_display_name
    return if display_name.present?

    self.display_name = username
  end
end
