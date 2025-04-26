# SEO Implementation TODO List

**Current Focus: Strategy 1 - Local Pages & Foundational Elements**

- [ ] **Server Actions:**
    - [x] Create `fetchTrainersByLocation` action in `src/actions/trainerActions.ts` (or similar file).
    - [x] Create `fetchClassesByLocation` action in `src/actions/classActions.ts` (or similar file).
    - [x] Create `fetchClubById` (or similar) action, potentially in `src/actions/clubActions.ts`. *(Needed for `SearchResultCard` refactor)*
- [ ] **Route Helper (`src/lib/routes.ts`):**
    - [x] Add route definition for `clubs.detail(clubId)`.
    - [x] Add route definition for `trainers.detail(trainerId)`.
    - [x] Add route definition for `classes.detail(classId)`.
- [ ] **Page Implementation (`src/app/locations/...`):**
    - [x] Implement `CityTrainersPage` (`.../trainers/page.tsx`):
        - [x] Fetch trainers using the new action.
        - [x] Generate dynamic metadata (`generateMetadata`).
        - [x] Display trainers list (create/use `TrainerCard` component).
        - [x] Use `Routes` helper for links.
    - [x] Implement `CityClassTypePage` (`.../classes/[classType]/page.tsx`):
        - [x] Fetch classes using the new action (filter by city *and* class type).
        - [x] Generate dynamic metadata.
        - [x] Display class list (create/use `ClassCard` component).
        - [x] Use `Routes` helper for links.
    - [x] Implement `CityOverviewPage` (`.../page.tsx`):
        - [x] Fetch general city data (e.g., featured gyms/trainers, class types available).
        - [x] Generate dynamic metadata.
        - [x] Update links to use `Routes` helper (including dynamic class type links).
        - [x] Display overview content.
- [ ] **Component Refactoring:**
    - [x] Create a reusable `GymCard` component in `src/components/gyms/` (or similar) and use it in `CityGymsPage`.
    - [x] Refactor `SearchResultCard` (`src/components/search/SearchResultCard.tsx`) to use `Routes.clubs.detail` once added.
- [ ] **Schema Markup:**
    - [x] Implement `LocalBusiness` (or more specific type like `SportsActivityLocation`) schema on `CityGymsPage`.
    - [x] Plan/Implement appropriate schema for `CityTrainersPage` and `CityClassTypePage`. *(Partially Done: Basic schema added)*

**Next Steps (After above is mostly done):**

- [ ] **Strategy 2 - Content Hub:**
    - [ ] Set up basic blog structure (`src/app/blog/...`).
    - [ ] Define blog post data source (e.g., Markdown, DB).
- [ ] **Strategy 3 - Reviews:**
    - [ ] Define `Review` model in `prisma/schema.prisma`.
    - [ ] Create basic review submission/fetching actions.
- [ ] **Strategy 4 - Technical SEO:**
    - [x] Set up `next-sitemap` or similar for sitemap generation.
    - [x] Create `public/robots.txt`. 