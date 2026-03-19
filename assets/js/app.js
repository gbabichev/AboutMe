const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const categorySections = document.querySelectorAll('.app-category');
const resetButton = document.getElementById('reset-filters');
const resultsSummary = document.getElementById('results-summary');
const emptyState = document.getElementById('empty-state');
const yearNode = document.getElementById('current-year');

const totalAppsNode = document.getElementById('stat-total-apps');
const appStoreNode = document.getElementById('stat-appstore');
const getActiveButton = (group) => {
    return document.querySelector(`.filter-btn.active[data-filter-group="${group}"]`);
};

const getActiveValue = (group) => {
    const button = getActiveButton(group);
    return button ? button.dataset[group] : 'all';
};

const getActiveLabel = (group) => {
    const button = getActiveButton(group);
    return button ? button.dataset.label : 'All';
};

const setActiveForGroup = (group, value) => {
    document.querySelectorAll(`.filter-btn[data-filter-group="${group}"]`).forEach((button) => {
        const isActive = button.dataset[group] === value;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });
};

const updateCounts = () => {
    const selectedPlatform = getActiveValue('platform');
    const selectedCategory = getActiveValue('category');

    filterButtons.forEach((button) => {
        const group = button.dataset.filterGroup;
        const value = button.dataset[group];

        const count = Array.from(projectCards).filter((card) => {
            const cardPlatforms = card.dataset.platforms || '';
            const cardCategory = card.dataset.category || '';

            const matchesPlatform =
                group === 'platform'
                    ? value === 'all' || cardPlatforms.includes(value)
                    : selectedPlatform === 'all' || cardPlatforms.includes(selectedPlatform);

            const matchesCategory =
                group === 'category'
                    ? value === 'all' || cardCategory === value
                    : selectedCategory === 'all' || cardCategory === selectedCategory;

            return matchesPlatform && matchesCategory;
        }).length;

        const countNode = button.querySelector('.filter-count');
        if (countNode) {
            countNode.textContent = `(${count})`;
        }
    });
};

const updateCategoryVisibility = () => {
    categorySections.forEach((section) => {
        const visibleCards = section.querySelectorAll('.project-card:not(.hidden)');
        const countNode = section.querySelector('.category-count');

        if (countNode) {
            countNode.textContent = `${visibleCards.length} app${visibleCards.length === 1 ? '' : 's'}`;
        }

        section.hidden = visibleCards.length === 0;
    });
};

const updateResultsSummary = () => {
    const visibleCount = document.querySelectorAll('.project-card:not(.hidden)').length;
    const totalCount = projectCards.length;
    const activeCategory = getActiveValue('category');
    const activePlatform = getActiveValue('platform');

    if (visibleCount === totalCount) {
        resultsSummary.textContent = `Showing all ${totalCount} apps.`;
        return;
    }

    const filters = [];
    if (activeCategory !== 'all') {
        filters.push(getActiveLabel('category'));
    }
    if (activePlatform !== 'all') {
        filters.push(getActiveLabel('platform'));
    }

    resultsSummary.textContent = `Showing ${visibleCount} app${visibleCount === 1 ? '' : 's'} for ${filters.join(' + ')}.`;
};

const applyFilters = () => {
    const selectedPlatform = getActiveValue('platform');
    const selectedCategory = getActiveValue('category');

    projectCards.forEach((card) => {
        const cardPlatforms = card.dataset.platforms || '';
        const cardCategory = card.dataset.category || '';

        const matchesPlatform =
            selectedPlatform === 'all' || cardPlatforms.includes(selectedPlatform);
        const matchesCategory =
            selectedCategory === 'all' || cardCategory === selectedCategory;

        card.classList.toggle('hidden', !(matchesPlatform && matchesCategory));
    });

    updateCounts();
    updateCategoryVisibility();
    updateResultsSummary();

    const visibleCount = document.querySelectorAll('.project-card:not(.hidden)').length;
    emptyState.hidden = visibleCount !== 0;
};

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const group = button.dataset.filterGroup;
        setActiveForGroup(group, button.dataset[group]);
        applyFilters();
    });
});

resetButton.addEventListener('click', () => {
    setActiveForGroup('category', 'all');
    setActiveForGroup('platform', 'all');
    applyFilters();
});

totalAppsNode.textContent = String(projectCards.length);
appStoreNode.textContent = String(
    Array.from(projectCards).filter((card) => card.querySelector('.appstore-link')).length
);
yearNode.textContent = String(new Date().getFullYear());

applyFilters();
