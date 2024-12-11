export async function validateNumber(number, id) {
    const regex = /^09\d{9}$/;

    if (!number) {
        return "Number cannot be empty.";
    } else if (!regex.test(number)) {
        return "Number must be in the format 09********* and exactly 11 digits long.";
    } else {
        const numberUsed = await checkNumber(number, id);
        if (numberUsed) {
            return "Number already been used for this quiz";
        } else {
            return "";
        }
    }
}

async function checkNumber(number, id) {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/check-number`,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ number, quiz_id: id }),
            }
        );

        const data = await response.json();

        if (data.message === true) {
            return "This number has already been used for this quiz.";
        } else {
            return "";
        }
    } catch (error) {
        console.error("Error checking number:", error);
        return false;
    }
}

export function validateNickname(nickname) {
    const regex = /^[a-zA-Z]{2,10}$/;
    if (!nickname) {
        return "Nickname cannot be empty.";
    } else if (!regex.test(nickname)) {
        return "Nickname must be 2-10 letters and contain no numbers.";
    } else {
        return "";
    }
}

export function validateAge(age) {
    if (!age) {
        return "Age cannot be empty.";
    }
    if (isNaN(age) || age < 1 || age >= 100) {
        return "Age must be a between 1 to 100.";
    }
    return "";
}

export function validateSelect(value) {
    if (!value) {
        return "This field cannot be empty.";
    }
    return "";
}
