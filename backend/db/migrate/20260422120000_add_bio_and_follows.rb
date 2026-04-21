# frozen_string_literal: true

class AddBioAndFollows < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :bio, :text, null: false, default: ""

    create_table :follows do |t|
      t.references :follower, null: false, foreign_key: { to_table: :users }
      t.references :following, null: false, foreign_key: { to_table: :users }

      t.timestamps
    end

    add_index :follows, %i[follower_id following_id], unique: true
  end
end
