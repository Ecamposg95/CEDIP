document.addEventListener('DOMContentLoaded', function() {
    const vacationTypeInputs = document.querySelectorAll('input[name="vacationType"]');
    const intervalDates = document.getElementById('intervalDates');
    const specificDates = document.getElementById('specificDates');

    $('#intervalDateRange').daterangepicker({
        locale: {
            format: 'DD/MM/YYYY',
            separator: " - ",
            applyLabel: "Aplicar",
            cancelLabel: "Cancelar",
            fromLabel: "Desde",
            toLabel: "Hasta",
            customRangeLabel: "Personalizado",
            weekLabel: "S",
            daysOfWeek: [
                "Do",
                "Lu",
                "Ma",
                "Mi",
                "Ju",
                "Vi",
                "Sa"
            ],
            monthNames: [
                "Enero",
                "Febrero",
                "Marzo",
                "Abril",
                "Mayo",
                "Junio",
                "Julio",
                "Agosto",
                "Septiembre",
                "Octubre",
                "Noviembre",
                "Diciembre"
            ],
            firstDay: 1
        }
    });

    $('#specificDays').multiDatesPicker({
        dateFormat: 'dd/mm/yy'
    });

    vacationTypeInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.value === 'interval') {
                intervalDates.style.display = 'block';
                specificDates.style.display = 'none';
            } else {
                intervalDates.style.display = 'none';
                specificDates.style.display = 'block';
            }
        });
    });

    document.getElementById('vacationForm').addEventListener('submit', function(event) {
        event.preventDefault();
        sendData();
    });
});

async function sendData() {
    const name = document.getElementById('name').value;
    const role = document.getElementById('role').value;
    const employmentRelation = document.getElementById('employmentRelation').value;
    const vacationType = document.querySelector('input[name="vacationType"]:checked').value;
    let intervalDateRange = '';
    let specificDays = '';

    if (vacationType === 'interval') {
        intervalDateRange = document.getElementById('intervalDateRange').value;
    } else {
        specificDays = document.getElementById('specificDays').value;
    }

    const data = {
        name,
        role,
        employmentRelation,
        vacationType,
        intervalDateRange,
        specificDays
    };

    const response = await fetch('https://api.github.com/repos/<your-username>/vacation-form/contents/data.json', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer <your-github-token>`,
        },
        body: JSON.stringify({
            message: 'Add new form entry',
            content: btoa(JSON.stringify(data)),
            sha: await getFileSHA()
        })
    });

    if (response.ok) {
        alert('Formulario enviado exitosamente');
    } else {
        alert('Error al enviar el formulario');
    }
}

async function getFileSHA() {
    const response = await fetch('https://api.github.com/repos/<your-username>/vacation-form/contents/data.json', {
        headers: {
            'Authorization': `Bearer <your-github-token>`
        }
    });

    if (response.ok) {
        const fileData = await response.json();
        return fileData.sha;
    } else {
        return null;
    }
}
