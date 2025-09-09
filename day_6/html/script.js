document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(res => res.json())
        .then(data => {
            document.getElementById('json-data').textContent = JSON.stringify(data);
        })
        .catch(err => {
            document.getElementById('json-data').textContent = 'Error loading data';
        });
});
