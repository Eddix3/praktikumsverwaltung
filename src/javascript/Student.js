export class AufgabeKursStudent {
    id
    name

    constructor(id, name) {
        this.id = id
        this.name = name
    }

    get id() {
        return this.id
    }

    get name() {
        return this.name
    }
}
export class Student extends AufgabeKursStudent{
    email
    stand
    note
    aufgaben = []
    meinStudent = false
    notizenDozent = ""
    notizenStudent = ""


    constructor(id, name, email) {
        super(id, name)
        this.email = email

    }

    get x() {

    }

    getDbInformationen(aufgabenListe) {

    }


}

export class AufgabenTermin extends AufgabeKursStudent{
    anwesenheit
    bewertung

}



