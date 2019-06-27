  class CreateRoomTypes < ActiveRecord::Migration[5.2]
  def change
    create_table :room_types do |t|
      t.string :name
      t.string :cover_photo
      t.integer :hotel_id

      t.timestamps
    end
  end
end
