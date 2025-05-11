# 🌲 ReLeaf NI

ReLeaf NI is a web platform that supports **reforestation efforts in Northern Ireland** by connecting users to donation opportunities, educational resources, and community events. Built with **Next.js, Prisma, and PostgreSQL**, the application is designed with accessibility, transparency, and user engagement in mind.

## 🎯 Project Purpose

Northern Ireland has one of the lowest forest cover percentages in Europe (8.6%). ReLeaf NI aims to:

- Increase public engagement with reforestation
- Simplify the donation process
- Provide educational tools for schools and communities
- Empower landowners with access to grants and reforestation support

## 🛠️ Tech Stack

- **Frontend & Backend**: [Next.js](https://nextjs.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Styling**: Tailwind CSS
- **Testing**: Jest (unit tests), manual UI testing

## 🚀 Features

- 💸 **Donation System** – Make micro-donations and view impact on a personalized dashboard
- 🌍 **Carbon Footprint Calculator** – Estimate and understand your environmental impact
- 📆 **Event Calendar** – View and register for local reforestation events
- 📚 **Educational Hub** – Access resources for schools and environmental groups
- 📌 **Grant Information** – Help landowners access government support
- 🗺️ **Interactive Map** – Visualize tree planting efforts across Northern Ireland

## 🧪 Testing

- Unit testing with Jest for API logic
- Integration testing via manual input and database inspection
- Exploratory and user acceptance testing following BDD-style Given-When-Then test cases

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/emulholland2002/releaf-ni.git
cd releaf-ni
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the root with the following:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/releaf
NEXTAUTH_SECRET=your-secret
```

Run the development server:

```bash
npm run dev
```

## 📈 Future Work

- Public leaderboards for top donors
- Full accessibility audit (WCAG 2.2 AA)
- Enhanced donation analytics
- Landowner registration and verification system

## 📚 Academic Context

This system was developed as part of an undergraduate dissertation for **BSc Business Information Technology** at **Queen’s University Belfast**. The project follows an Agile Scrum lifecycle adapted for solo development and is grounded in the UN’s Sustainable Development Goal 15: Life on Land.

## 📄 License

This project is academic and currently not licensed for commercial use.
