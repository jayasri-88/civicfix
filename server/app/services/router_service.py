def get_department(label: str) -> str:
    mapping = {
        "plastic": "Sanitation Department",
        "paper": "Sanitation Department",
        "cardboard": "Sanitation Department",
        "trash": "Municipal Waste Department"
    }
    return mapping.get(label, "General Department")