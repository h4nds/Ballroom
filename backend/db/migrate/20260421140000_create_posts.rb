# frozen_string_literal: true

class CreatePosts < ActiveRecord::Migration[8.0]
  def change
    create_table :posts do |t|
      t.references :user, null: false, foreign_key: true
      t.string :board_slug, null: false
      t.string :title, null: false
      t.text :body, null: false

      t.timestamps
    end

    add_index :posts, %i[board_slug created_at]
  end
end
