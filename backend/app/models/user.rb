# frozen_string_literal: true

class User < ApplicationRecord
  DISCIPLINES = %w[visual motion music writing general].freeze
  ACCENTS = %w[purple green yellow].freeze

  has_secure_password

  before_validation :normalize_username
  before_validation :default_display_name

  validates :username, presence: true, length: { maximum: 32 }, uniqueness: { case_sensitive: false }
  validates :display_name, presence: true, length: { maximum: 48 }
  validates :password, length: { minimum: 8 }, if: -> { password.present? }
  validates :discipline, inclusion: { in: DISCIPLINES }
  validates :accent, inclusion: { in: ACCENTS }

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
