export async function validateNumber(number, id) {
    const regex = /^09\d{9}$/;

    if (!number) {
        return 'Number cannot be empty.';
    } else if (!regex.test(number)) {
        return 'Number must be in the format 09********* and exactly 11 digits long.';
    } else {
        const numberUsed = await checkNumber(number, id);
        if (numberUsed) {
            return 'Number already been used for this quiz';
        } else {
            return '';
        }
    }
}

async function checkNumber(number, id) {
    console.log(number, id);
    try {
        const response = await fetch('/api/check-number', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ number, quiz_id: id })
        });

        const data = await response.json();
        console.log(data);

        return data.exists && data.hasExistingAnswers;
    } catch (error) {
        console.error('Error checking number:', error);
        return false;
    }
}

export function validateNickname(nickname) {
    const regex = /^[a-zA-Z]{2,10}$/;
    if (!nickname) {
        return 'Nickname cannot be empty.';
    } else if (!regex.test(nickname)) {
        return 'Nickname must be 2-10 letters and contain no numbers.';
    } else {
        return '';
    }
}

export function validateAge(age) {
    if (!age) {
        return 'Age cannot be empty.';
    }
    if (isNaN(age) || age <= 0) {
        return 'Age must be a positive number.';
    }
    return '';
}

export function validateSelect(value) {
    if (!value) {
        return 'This field cannot be empty.';
    }
    return '';
}
