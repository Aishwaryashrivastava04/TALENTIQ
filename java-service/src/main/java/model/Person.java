package model;

/**
 * ============================================================================
 * SUBJECT 2: CORE JAVA - ABSTRACTION & ENCAPSULATION
 * Abstract base class representing a human actor in the recruitment platform.
 * Demonstrates:
 * - Data Abstraction (cannot be directly instantiated)
 * - Encapsulation (private fields with public getters/setters)
 * - Abstract methods to be overridden by sub-classes (Polymorphism)
 * ============================================================================
 */
public abstract class Person {
    private int id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;

    // Default Constructor
    public Person() {
    }

    // Parameterized Constructor
    public Person(int id, String firstName, String lastName, String email, String phone) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
    }

    // Abstract method: To be implemented by derived classes (Polymorphism)
    public abstract String getRoleTitle();

    // Abstract method: Enforces custom summary display in children
    public abstract String getDisplaySummary();

    // Concrete method common to all Person sub-types
    public String getFullName() {
        return (firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "");
    }

    // Encapsulation: Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    @Override
    public String toString() {
        return "Person{" +
                "id=" + id +
                ", fullName='" + getFullName() + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                '}';
    }
}
