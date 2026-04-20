# frozen_string_literal: true

class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :username, null: false
      t.string :display_name, null: false
      t.string :password_digest, null: false
      t.string :discipline, null: false, default: "general"
      t.string :accent, null: false, default: "purple"
      t.boolean :sounds_enabled, null: false, default: true

      t.timestamps
    end

    add_index :users, :username, unique: true
  end
end
