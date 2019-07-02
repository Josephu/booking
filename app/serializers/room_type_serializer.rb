class RoomTypeSerializer < ActiveModel::Serializer
  attributes :id, :name, :average_monthly_rate, :available,
    :move_in_date, :move_out_date

  def average_monthly_rate
    return nil if !move_in_date || !move_out_date
    RoomTypeDate
      .where(room_type_id: @object.id)
      .where(date: move_in_date..(move_out_date - 1.day)) # excluding the last day
      .average(:rate) * 30
  end

  def available
    true
  end

  def move_in_date
    @instance_options[:move_in_date]
  end

  def move_out_date
    @instance_options[:move_out_date]
  end
end
