class CreateRoomTypeDates < ActiveRecord::Migration[5.2]
  def change
    create_table :room_type_dates do |t|
      t.date :date
      t.decimal :rate
      t.integer :room_type_id
      t.integer :availability

      t.timestamps
    end
  end
end
