// Defining the type of rooms available for booking
const availableRooms = [
    { id: 1, name: "Mini Room", bookings: [] },
    { id: 2, name: "Medium Room", bookings: [] },
    { id: 3, name: "Large Room", bookings: [] },
];


// defining the timeslots for each of room type linking them to the id of the room
const timeSlots = {
    1: ['09:00 AM - 09:30 AM', '09:30 AM - 10:00 AM', '10:00 AM - 10:30 AM', '10:30 AM - 11:00 AM', '11:00 AM - 11:30 AM', '11:30 AM - 12:00 PM'],
    2: ['09:00 AM - 09:30 AM', '09:30 AM - 10:00 AM', '10:00 AM - 10:30 AM', '10:30 AM - 11:00 AM', '11:00 AM - 11:30 AM', '11:30 AM - 12:00 PM'],
    3: ['09:00 AM - 09:30 AM', '09:30 AM - 10:00 AM', '10:00 AM - 10:30 AM', '10:30 AM - 11:00 AM', '11:00 AM - 11:30 AM', '11:30 AM - 12:00 PM']
};


// calling the element from html and assigning a variable to call the variable for further operations
const roomSelect = document.getElementById('room-select');
const timeSlotSelect = document.getElementById('time-slot-select');
const bookingsList = document.getElementById('bookings-list');


// this function is written for showing availableRooms at the top of the html document just for the user to understand which room to book
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


// this function initializes the dropdowns to select the given room types and time slots in javascript
function initializeDropdowns() {
    roomSelect.innerHTML = '<option value="" selected disabled>Select a Room</option>';
    timeSlotSelect.innerHTML = '<option value="" selected disabled>Select a Time Slot</option>';

    availableRooms.forEach(room => {
        const option = document.createElement('option');
        option.value = room.id;
        option.textContent = room.name;
        roomSelect.appendChild(option);
    });

    // set time slots based on the selected room for ex. mini room - all the time slots will be shown assigned for mini room
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


// function to book the room
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

            // Update the time slots dropdown after a particular time slot is already booked
            populateTimeSlots(roomId);

            updateBookingsList();
        } else {
            alert('This room is already booked for the selected time slot.');
        }
    } else {
        alert('Please select both a room and a time slot.');
    }
}

// Function to populate time slots based on the selected room as said above for each, 
// room dedicated time slots are made available for booking
function populateTimeSlots(roomId) {

    // this line below brings out the time slots which are linked to the roomId like in rooms the id:1 is for mini rooms so it brings,
    // out all the time slots available for mini rooms. if there are no rooms available for the time slots then it will return empty array.
    const slots = timeSlots[roomId] || [];
    
    timeSlotSelect.innerHTML = '<option value="" selected disabled>Select a Time Slot</option>';
    slots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot;
        option.textContent = slot;
        timeSlotSelect.appendChild(option);
    });
}


// this function is for cancelling the bookings made

function cancelBooking(roomId, booking) {
    const selectedRoom = availableRooms.find(room => room.id === roomId);

    // this part of the code checks if the booking we want to cancel which is in the array of bookings
    // it filters the bookings array of the selectedRoom. The filter method is used to create a new 
    // array with all elements that do not match the provided condition.
    if (selectedRoom) {
        selectedRoom.bookings = selectedRoom.bookings.filter(item => item !== booking);
        updateBookingsList();
    }
}

// this function is about updating the bookings into new section showing all bookings in time order
function updateBookingsList() {
    const bookingsList = document.getElementById('bookingsList');
    bookingsList.innerHTML = '';

    availableRooms.forEach(room => {
        // Sort the room's bookings by time
        const sortedBookings = room.bookings.sort((a, b) => {
            // Assuming the time slots are in the format "HH:mm AM/PM
            const timeA = new Date('1970-01-01 ' + a);
            const timeB = new Date('1970-01-01 ' + b);
            
            return timeA - timeB;
        });

        // This code dynamically generates the HTML elements to display the room name, 
        // the list of bookings for that room, and the option to cancel each booking. It organizes this information in a structured manner
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



// this function is to update the dropdowns for the time slots if all those have been booked

function updateDropdowns() {
    timeSlotSelect.innerHTML = '<option value="" selected disabled>Select a Time Slot</option>';

    timeSlots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot;
        option.textContent = slot;
        timeSlotSelect.appendChild(option);
    });
}


// and finally calling out the initializing the dropdown function and update bookings list.
// as they are the only functions which show output.
initializeDropdowns();
updateBookingsList();