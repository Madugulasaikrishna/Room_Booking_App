const availableRooms = [
    { id: 1, name: "Mini Room", bookings: [] },
    { id: 2, name: "Medium Room", bookings: [] },
    { id: 3, name: "Large Room", bookings: [] },
];

const timeSlots = {
    1: ['09:00 AM - 09:30 AM', '09:30 AM - 10:00 AM', '10:00 AM - 10:30 AM', '10:30 AM - 11:00 AM', '11:00 AM - 11:30 AM', '11:30 AM - 12:00 PM'],
    2: ['09:00 AM - 09:30 AM', '09:30 AM - 10:00 AM', '10:00 AM - 10:30 AM', '10:30 AM - 11:00 AM', '11:00 AM - 11:30 AM', '11:30 AM - 12:00 PM'],
    3: ['09:00 AM - 09:30 AM', '09:30 AM - 10:00 AM', '10:00 AM - 10:30 AM', '10:30 AM - 11:00 AM', '11:00 AM - 11:30 AM', '11:30 AM - 12:00 PM']
};

const roomSelect = document.getElementById('room-select');
const timeSlotSelect = document.getElementById('time-slot-select');
const bookingsList = document.getElementById('bookings-list');


function showAvailableRooms() {
    const roomListItems = document.getElementById('room-list-items');
    roomListItems.innerHTML = '';

    availableRooms.forEach(room => {
        const listItem = document.createElement('li');
        listItem.textContent = room.name;
        roomListItems.appendChild(listItem);
    });
}
document.addEventListener('DOMContentLoaded', showAvailableRooms);


function initializeDropdowns() {
    roomSelect.innerHTML = '<option value="" selected disabled>Select a Room</option>';
    timeSlotSelect.innerHTML = '<option value="" selected disabled>Select a Time Slot</option>';

    availableRooms.forEach(room => {
        const option = document.createElement('option');
        option.value = room.id;
        option.textContent = room.name;
        roomSelect.appendChild(option);
    });

    // Populate time slots based on the selected room
    roomSelect.addEventListener('change', function () {
        const roomId = roomSelect.value;
        const slots = timeSlots[roomId] || [];
        
        timeSlotSelect.innerHTML = '<option value="" selected disabled>Select a Time Slot</option>';
        slots.forEach(slot => {
            const option = document.createElement('option');
            option.value = slot;
            option.textContent = slot;
            timeSlotSelect.appendChild(option);
        });
    });
}

function bookRoom() {
    const roomId = roomSelect.value;
    const selectedRoom = availableRooms.find(room => room.id === parseInt(roomId));
    const selectedTimeSlot = timeSlotSelect.value;

    if (roomId && selectedTimeSlot) {
        if (!selectedRoom.bookings.includes(selectedTimeSlot)) {
            selectedRoom.bookings.push(selectedTimeSlot);

            // Remove the booked time slot from the available time slots for the selected room
            const index = timeSlots[roomId].indexOf(selectedTimeSlot);
            if (index !== -1) {
                timeSlots[roomId].splice(index, 1);
            }

            // Update the time slots dropdown
            populateTimeSlots(roomId);

            updateBookingsList();
        } else {
            alert('This room is already booked for the selected time slot.');
        }
    } else {
        alert('Please select both a room and a time slot.');
    }
}

// Function to populate time slots based on the selected room
function populateTimeSlots(roomId) {
    const slots = timeSlots[roomId] || [];
    
    timeSlotSelect.innerHTML = '<option value="" selected disabled>Select a Time Slot</option>';
    slots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot;
        option.textContent = slot;
        timeSlotSelect.appendChild(option);
    });
}



function cancelBooking(roomId, booking) {
    const selectedRoom = availableRooms.find(room => room.id === roomId);

    if (selectedRoom) {
        selectedRoom.bookings = selectedRoom.bookings.filter(item => item !== booking);
        updateBookingsList();
    }
}

function updateBookingsList() {
    const bookingsList = document.getElementById('bookingsList');
    bookingsList.innerHTML = '';

    availableRooms.forEach(room => {
        // Sort the room's bookings by time
        const sortedBookings = room.bookings.sort((a, b) => {
            // Assuming the time slots are in the format "HH:mm AM/PM"
            const timeA = new Date('1970-01-01 ' + a);
            const timeB = new Date('1970-01-01 ' + b);
            
            return timeA - timeB;
        });

        if (sortedBookings.length > 0) {
            const roomHeading = document.createElement('h3');
            roomHeading.textContent = room.name;
            bookingsList.appendChild(roomHeading);

            const bookingContainer = document.createElement('div');
            bookingContainer.className = 'booking-container';

            sortedBookings.forEach(booking => {
                const bookingItem = document.createElement('div');
                bookingItem.className = 'booking-item';

                const timing = document.createElement('div');
                timing.className = 'timing';
                timing.textContent = booking;

                const cancelButton = document.createElement('div');
                cancelButton.className = 'cancel-button';
                cancelButton.innerHTML = `<button type="button" class="cancelButton btn btn-primary btn-lg" onclick="cancelBooking(${room.id}, '${booking}')">Cancel Booking</button>`;

                bookingItem.appendChild(timing);
                bookingItem.appendChild(cancelButton);

                bookingContainer.appendChild(bookingItem);
            });

            bookingsList.appendChild(bookingContainer);
        }
    });
}





function updateDropdowns() {
    timeSlotSelect.innerHTML = '<option value="" selected disabled>Select a Time Slot</option>';

    timeSlots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot;
        option.textContent = slot;
        timeSlotSelect.appendChild(option);
    });
}



initializeDropdowns();
updateBookingsList();