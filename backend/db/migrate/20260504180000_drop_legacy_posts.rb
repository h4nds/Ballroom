# frozen_string_literal: true

class DropLegacyPosts < ActiveRecord::Migration[8.0]
  def up
    drop_table :posts, if_exists: true
  end

  def down
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
