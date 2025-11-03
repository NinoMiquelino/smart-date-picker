 class SmartDatePicker {
    constructor(config) {
        this.config = {
            container: '',
            placeholder: 'DD/MM/AAAA',
            value: null,
            minDate: null,
            maxDate: null,
            disabled: false,
            onSelect: () => {},
            ...config
        };

        this.selectedDate = this.config.value ? new Date(this.config.value) : null;
        this.isOpen = false;
        this.currentView = 'year';
        this.currentYear = new Date().getFullYear();
        this.currentMonth = new Date().getMonth();
        this.inputValue = '';
        
        this.init();
    }

    init() {
        this.createDOM();
        this.bindEvents();
        this.updateDisplay();
    }

    createDOM() {
        const container = typeof this.config.container === 'string' 
            ? document.querySelector(this.config.container) 
            : this.config.container;

        if (!container) {
            console.error('Container não encontrado:', this.config.container);
            return;
        }               

        container.innerHTML = `
            <div class="relative w-full">
                <!-- Input Field -->
                <div class="date-input-wrapper relative">
                    <input 
                        type="text" 
                        class="date-input w-full px-4 py-3
                               border-2 border-gray-300 dark:border-gray-600 
                               rounded-xl
                               bg-white dark:bg-gray-700 
                               text-gray-900 dark:text-white 
                               placeholder-gray-500 dark:placeholder-gray-400
                               focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                               text-sm transition-all duration-200
                               pr-12"
                        placeholder="${this.config.placeholder}"
                        ${this.config.disabled ? 'disabled' : ''}
                    >
                    <button 
                        type="button"
                        class="calendar-button absolute right-3 top-1/2 transform -translate-y-1/2
                               w-8 h-8 flex items-center justify-center
                               text-gray-400 hover:text-blue-500 
                               transition-colors duration-200
                               ${this.config.disabled ? 'opacity-50 cursor-not-allowed' : ''}"
                        ${this.config.disabled ? 'disabled' : ''}
                    >
                        <i class="fas fa-calendar-alt"></i>
                    </button>
                </div>

                <!-- Date Picker Dropdown -->
                <div class="date-picker-dropdown 
                    absolute top-full left-0 right-0 z-50 mt-2 
                    bg-white dark:bg-gray-800 
                    border-2 border-gray-200 dark:border-gray-700 
                    rounded-xl shadow-2xl 
                    overflow-hidden
                    transform origin-top
                    transition-all duration-200
                    scale-95 opacity-0 pointer-events-none
                    slide-down">
                    
                    <!-- Header com Navegação -->
                    <div class="picker-header bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                        <div class="flex justify-between items-center mb-3">
                            <button class="nav-button prev w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-400 transition-colors duration-200">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            
                            <div class="current-view-display flex items-center space-x-2">
                                <button class="view-button text-lg font-semibold hover:underline transition-all duration-200" data-view="year">
                                    <span id="currentYear">${this.currentYear}</span>
                                </button>
                                <span class="text-blue-200">|</span>
                                <button class="view-button text-lg font-semibold hover:underline transition-all duration-200" data-view="month">
                                    <span id="currentMonth">${this.getMonthName(this.currentMonth)}</span>
                                </button>
                            </div>
                            
                            <button class="nav-button next w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-400 transition-colors duration-200">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                        
                        <!-- Quick Actions -->
                        <div class="quick-actions flex justify-center space-x-2">
                            <button class="quick-action px-3 py-1 bg-blue-400 hover:bg-blue-300 rounded-lg text-sm transition-colors duration-200" data-action="today">
                                Hoje
                            </button>
                            <button class="quick-action px-3 py-1 bg-blue-400 hover:bg-blue-300 rounded-lg text-sm transition-colors duration-200" data-action="clear">
                                Limpar
                            </button>
                        </div>
                    </div>

                    <!-- Content Area -->
                    <div class="picker-content p-4 max-h-80 overflow-y-auto custom-scrollbar">
                        <div class="view-container">
                            <!-- Year View -->
                            <div class="year-view grid grid-cols-3 gap-2" style="display: none;">
                                <!-- Os anos serão gerados dinamicamente -->
                            </div>

                            <!-- Month View -->
                            <div class="month-view grid grid-cols-3 gap-3" style="display: none;">
                                <!-- Os meses serão gerados dinamicamente -->
                            </div>

                            <!-- Day View -->
                            <div class="day-view" style="display: none;">
                                <div class="week-days grid grid-cols-7 gap-1 mb-2">
                                    ${['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => `
                                        <div class="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1">
                                            ${day}
                                        </div>
                                    `).join('')}
                                </div>
                                <div class="days-grid grid grid-cols-7 gap-1">
                                    <!-- Os dias serão gerados dinamicamente -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.elements = {
            input: container.querySelector('.date-input'),
            calendarButton: container.querySelector('.calendar-button'),
            dropdown: container.querySelector('.date-picker-dropdown'),
            currentYear: container.querySelector('#currentYear'),
            currentMonth: container.querySelector('#currentMonth'),
            viewButtons: container.querySelectorAll('.view-button'),
            navButtons: container.querySelectorAll('.nav-button'),
            quickActions: container.querySelectorAll('.quick-action'),
            yearView: container.querySelector('.year-view'),
            monthView: container.querySelector('.month-view'),
            dayView: container.querySelector('.day-view'),
            daysGrid: container.querySelector('.days-grid')
        };

        // Inicializar as views
        this.initializeViews();
    }

    initializeViews() {
        // Gerar conteúdo inicial para todas as views
        this.elements.yearView.innerHTML = this.generateYearGrid();
        this.elements.monthView.innerHTML = this.generateMonthGrid();
        this.elements.daysGrid.innerHTML = this.generateDayGrid();
    }

    bindEvents() {
        // Toggle dropdown
        this.elements.calendarButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });

        // Input events
        this.elements.input.addEventListener('focus', () => {
            this.elements.input.classList.add('border-blue-500', 'ring-2', 'ring-blue-200');
        });

        this.elements.input.addEventListener('blur', () => {
            this.elements.input.classList.remove('border-blue-500', 'ring-2', 'ring-blue-200');
            this.validateAndSetInput();
        });

        this.elements.input.addEventListener('input', (e) => {       	                   
            this.handleInput(e.target.value);
        });            

        this.elements.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.validateAndSetInput();
            }                                                 
        });
        

        // View navigation
        this.elements.viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const view = button.getAttribute('data-view');
                this.switchView(view);
            });
        });

        // Navigation buttons
        this.elements.navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const isNext = button.classList.contains('next');
                this.handleNavigation(isNext);
            });
        });

        // Quick actions
        this.elements.quickActions.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = button.getAttribute('data-action');
                this.handleQuickAction(action);
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            this.closeDropdown();
        });

        // Prevent dropdown close when clicking inside
        this.elements.dropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });       
    }

handleInput(value) {
    const input = this.elements.input;
    const previousValue = input.value;
    const cursorPosition = input.selectionStart;
    
    // 1. Limpar: Remover todos os caracteres que NÃO são dígitos
    let cleanedValue = value.replace(/[^\d]/g, '');
    
    // 2. Limitar o comprimento
    if (cleanedValue.length > 8) {
        // Se o valor limpo exceder 8 dígitos, tronca.
        cleanedValue = cleanedValue.substring(0, 8);
    }
    
    // 3. Aplicar Formatação: DD/MM/AAAA
    let formattedValue = '';
    if (cleanedValue.length > 0) {
        formattedValue += cleanedValue.substring(0, 2);
    }
    if (cleanedValue.length > 2) {
        formattedValue += '/' + cleanedValue.substring(2, 4);
    }
    if (cleanedValue.length > 4) {
        formattedValue += '/' + cleanedValue.substring(4, 8);
    }
    
    // 4. Atualizar o Input e Cursor (Apenas se o valor formatado for diferente)
    if (formattedValue !== previousValue) {
        input.value = formattedValue;
        
        // Ajustar a posição do cursor após a formatação
        // O ajuste é necessário para que o cursor "pule" as barras '/'
        
        let newCursorPosition = cursorPosition;

        // Se o novo valor tem mais caracteres que o anterior (adicionou um dígito)
        if (formattedValue.length > previousValue.length) {
            // Se digitou no índice 2 (e virou 2/...)
            if (newCursorPosition === 3 && formattedValue.charAt(2) === '/') {
                newCursorPosition = 4; // Pula a primeira barra
            } 
            // Se digitou no índice 5 (e virou .../4/...)
            else if (newCursorPosition === 6 && formattedValue.charAt(5) === '/') {
                newCursorPosition = 7; // Pula a segunda barra
            } 
        } else if (formattedValue.length < previousValue.length) {
            // Lidar com o caso de backspace: Se a posição do cursor está após uma barra, recuar um dígito extra
            if ((previousValue.charAt(cursorPosition) === '/' && formattedValue.charAt(cursorPosition - 1) === '/') ||
                (previousValue.charAt(cursorPosition - 1) === '/' && formattedValue.charAt(cursorPosition - 2) === '/')) {
                newCursorPosition--;
            }
        }
        
        // Garante que o cursor não vá além do final e não quebre a posição
        newCursorPosition = Math.min(newCursorPosition, formattedValue.length);

        // Define a posição do cursor no próximo ciclo de evento
        setTimeout(() => {
            input.setSelectionRange(newCursorPosition, newCursorPosition);
        }, 0);
    }

    // 5. Validar quando a data estiver completa (8 dígitos)
    if (cleanedValue.length === 8) {
        setTimeout(() => this.validateAndSetInput(), 100);
    }
}
    
  validateAndSetInput() {
    const value = this.elements.input.value;
    
    // Permitir campo vazio
    if (value.trim() === '' || value === '//' || value === '/' || !value.includes('/')) {
        this.selectedDate = null;
        this.config.onSelect(null);
        return;
    }
    
    // Verificar formato básico DD/MM/AAAA
    const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{1,4})$/;
    const match = value.match(dateRegex);
    
    if (!match) {
        this.showError('Formato inválido. Use DD/MM/AAAA');
        return;
    }
    
    let day = parseInt(match[1]);
    let month = parseInt(match[2]) - 1; // JavaScript months are 0-indexed
    let year = parseInt(match[3]);
    
    // Completar ano com 20xx se tiver apenas 2 dígitos
    if (year < 100) {
        year += 2000;
    }
    
    // Validações rigorosas
    if (year < 1900 || year > 2100) {
        this.showError('Ano deve estar entre 1900 e 2100');
        return;
    }
    
    if (month < 0 || month > 11) {
        this.showError('Mês deve estar entre 01 e 12');
        return;
    }
    
    // Validar dias do mês
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    if (day < 1 || day > daysInMonth) {
        const monthName = this.getMonthName(month);
        this.showError(`Dia inválido para ${monthName}/${year}. Máximo: ${daysInMonth} dias`);
        return;
    }
    
    const date = new Date(year, month, day);
    
    // Verificar se a data é válida (double check)
    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
        this.showError('Data inválida');
        return;
    }
    
    // Verificar restrições de data mínima/máxima
    if (this.isDayDisabled(date)) {
        const minStr = this.config.minDate ? this.config.minDate.toLocaleDateString('pt-BR') : 'sem limite';
        const maxStr = this.config.maxDate ? this.config.maxDate.toLocaleDateString('pt-BR') : 'sem limite';
        this.showError(`Data fora do intervalo permitido (${minStr} - ${maxStr})`);
        return;
    }
    
    // Tudo validado - selecionar a data
    this.selectDate(date);
    
    // Atualizar o display com formatação correta
    const formattedDay = String(day).padStart(2, '0');
    const formattedMonth = String(month + 1).padStart(2, '0');
    this.elements.input.value = `${formattedDay}/${formattedMonth}/${year}`;
}  

    showError(message) {
        const input = this.elements.input;
        input.classList.add('border-red-500', 'ring-2', 'ring-red-200', 'bg-red-50');
        
        this.showErrorTooltip(message);
        
        setTimeout(() => {
            input.classList.remove('border-red-500', 'ring-2', 'ring-red-200', 'bg-red-50');
            this.hideErrorTooltip();
        }, 3000);
    }

    showErrorTooltip(message) {
        this.hideErrorTooltip();
        
        const tooltip = document.createElement('div');
        tooltip.className = 'absolute top-full left-0 right-0 mt-1 z-50';
        tooltip.innerHTML = `
            <div class="bg-red-500 text-white text-xs rounded-lg py-2 px-3 shadow-lg text-center animate-pulse">
                <i class="fas fa-exclamation-triangle mr-1"></i>
                ${message}
            </div>
        `;
        
        tooltip.id = 'datepicker-error-tooltip';
        this.elements.input.parentNode.appendChild(tooltip);
    }

    hideErrorTooltip() {
        const existingTooltip = document.getElementById('datepicker-error-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
    }

    toggleDropdown() {
        if (this.isOpen) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }

    openDropdown() {
        if (this.config.disabled) return;

        this.isOpen = true;
        this.elements.dropdown.classList.remove('scale-95', 'opacity-0', 'pointer-events-none');
        this.elements.dropdown.classList.add('scale-100', 'opacity-100');
        
        this.switchView('year');
    }

    closeDropdown() {
        this.isOpen = false;
        this.elements.dropdown.classList.add('scale-95', 'opacity-0', 'pointer-events-none');
        this.elements.dropdown.classList.remove('scale-100', 'opacity-100');
    }

    switchView(view) {
        this.currentView = view;
        
        // Esconder todas as views
        this.elements.yearView.style.display = 'none';
        this.elements.monthView.style.display = 'none';
        this.elements.dayView.style.display = 'none';
        
        // Mostrar a view atual
        if (view === 'year') {
            this.elements.yearView.style.display = 'grid';
            this.elements.yearView.innerHTML = this.generateYearGrid();
        } else if (view === 'month') {
            this.elements.monthView.style.display = 'grid';
            this.elements.monthView.innerHTML = this.generateMonthGrid();
        } else if (view === 'day') {
            this.elements.dayView.style.display = 'block';
            this.elements.daysGrid.innerHTML = this.generateDayGrid();
        }
        
        this.bindGridEvents();
    }

    handleNavigation(isNext) {
        if (this.currentView === 'year') {
            this.currentYear += isNext ? 12 : -12;
            this.elements.yearView.innerHTML = this.generateYearGrid();
            this.elements.currentYear.textContent = this.currentYear;
        } else if (this.currentView === 'month') {
            this.currentYear += isNext ? 1 : -1;
            this.elements.currentYear.textContent = this.currentYear;
        } else if (this.currentView === 'day') {
            this.currentMonth += isNext ? 1 : -1;
            
            if (this.currentMonth > 11) {
                this.currentMonth = 0;
                this.currentYear++;
            } else if (this.currentMonth < 0) {
                this.currentMonth = 11;
                this.currentYear--;
            }
            
            this.elements.currentYear.textContent = this.currentYear;
            this.elements.currentMonth.textContent = this.getMonthName(this.currentMonth);
            this.elements.daysGrid.innerHTML = this.generateDayGrid();
        }
        
        this.bindGridEvents();
    }

    generateYearGrid() {
        const startYear = this.currentYear - 6;
        const years = [];
        
        for (let i = 0; i < 12; i++) {
            const year = startYear + i;
            const isSelected = this.selectedDate && this.selectedDate.getFullYear() === year;
            const isCurrent = year === new Date().getFullYear();
            const isDisabled = this.isYearDisabled(year);
            
            years.push(`
                <button class="year-item w-full py-3 px-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isSelected ? 'bg-blue-500 text-white' : 
                      isCurrent ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' :
                      isDisabled ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' :
                      'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}"
                    ${isDisabled ? 'disabled' : ''}
                    data-year="${year}">
                    ${year}
                </button>
            `);
        }
        
        return years.join('');
    }

    generateMonthGrid() {
        const months = [];
        const currentYear = this.currentYear;
        
        for (let month = 0; month < 12; month++) {
            const monthName = this.getMonthName(month, true);
            const isSelected = this.selectedDate && 
                             this.selectedDate.getFullYear() === currentYear && 
                             this.selectedDate.getMonth() === month;
            const isCurrent = currentYear === new Date().getFullYear() && month === new Date().getMonth();
            const isDisabled = this.isMonthDisabled(currentYear, month);
            
            months.push(`
                <button class="month-item w-full py-3 px-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isSelected ? 'bg-blue-500 text-white' : 
                      isCurrent ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' :
                      isDisabled ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' :
                      'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}"
                    ${isDisabled ? 'disabled' : ''}
                    data-month="${month}">
                    ${monthName}
                </button>
            `);
        }
        
        return months.join('');
    }

    generateDayGrid() {
        const year = this.currentYear;
        const month = this.currentMonth;
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        let days = [];
        
        // Dias vazios no início
        for (let i = 0; i < startingDay; i++) {
            days.push('<div class="h-8"></div>');
        }
        
        // Dias do mês
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isSelected = this.selectedDate && 
                             this.selectedDate.getDate() === day &&
                             this.selectedDate.getMonth() === month &&
                             this.selectedDate.getFullYear() === year;
            const isToday = this.isToday(date);
            const isDisabled = this.isDayDisabled(date);
            
            days.push(`
                <button class="day-item h-8 w-8 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center
                    ${isSelected ? 'bg-blue-500 text-white' : 
                      isToday ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                      isDisabled ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' :
                      'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}"
                    ${isDisabled ? 'disabled' : ''}
                    data-day="${day}">
                    ${day}
                </button>
            `);
        }
        
        return days.join('');
    }

    bindGridEvents() {
        // Year selection
        this.elements.yearView.querySelectorAll('.year-item:not([disabled])').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.currentYear = parseInt(button.getAttribute('data-year'));
                this.elements.currentYear.textContent = this.currentYear;
                this.switchView('month');
            });
        });

        // Month selection
        this.elements.monthView.querySelectorAll('.month-item:not([disabled])').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.currentMonth = parseInt(button.getAttribute('data-month'));
                this.elements.currentMonth.textContent = this.getMonthName(this.currentMonth);
                this.switchView('day');
            });
        });

        // Day selection
        this.elements.daysGrid.querySelectorAll('.day-item:not([disabled])').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const day = parseInt(button.getAttribute('data-day'));
                this.selectDate(new Date(this.currentYear, this.currentMonth, day));
            });
        });
    }

    selectDate(date) {
        this.selectedDate = date;
        this.updateDisplay();
        this.closeDropdown();
        this.config.onSelect(date);
    }

    handleQuickAction(action) {
        if (action === 'today') {
            this.selectDate(new Date());
        } else if (action === 'clear') {
            this.selectedDate = null;
            this.elements.input.value = '';
            this.updateDisplay();
            this.config.onSelect(null);
            this.closeDropdown();
        }
    }

    updateDisplay() {
        if (this.selectedDate) {
            const day = String(this.selectedDate.getDate()).padStart(2, '0');
            const month = String(this.selectedDate.getMonth() + 1).padStart(2, '0');
            const year = this.selectedDate.getFullYear();
            this.elements.input.value = `${day}/${month}/${year}`;
        }
    }

    getMonthName(month, short = false) {
        const months = short ? 
            ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'] :
            ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        return months[month];
    }

    isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() && 
               date.getMonth() === today.getMonth() && 
               date.getFullYear() === today.getFullYear();
    }

    isYearDisabled(year) {
        if (this.config.minDate && year < this.config.minDate.getFullYear()) return true;
        if (this.config.maxDate && year > this.config.maxDate.getFullYear()) return true;
        return false;
    }

    isMonthDisabled(year, month) {
        const date = new Date(year, month, 1);
        if (this.config.minDate && date < new Date(this.config.minDate.getFullYear(), this.config.minDate.getMonth(), 1)) return true;
        if (this.config.maxDate && date > new Date(this.config.maxDate.getFullYear(), this.config.maxDate.getMonth() + 1, 0)) return true;
        return false;
    }

    isDayDisabled(date) {
        if (this.config.minDate && date < this.config.minDate) return true;
        if (this.config.maxDate && date > this.config.maxDate) return true;
        return false;
    }

    getValue() {
        return this.selectedDate;
    }

    setValue(date) {
        if (date instanceof Date && !isNaN(date)) {
            this.selectedDate = date;
            this.updateDisplay();
        }
    }

    clear() {
        this.selectedDate = null;
        this.elements.input.value = '';
        this.config.onSelect(null);
    }

    enable() {
        this.config.disabled = false;
        this.elements.input.disabled = false;
        this.elements.calendarButton.disabled = false;
        this.elements.calendarButton.classList.remove('opacity-50', 'cursor-not-allowed');
    }

    disable() {
        this.config.disabled = true;
        this.elements.input.disabled = true;
        this.elements.calendarButton.disabled = true;
        this.elements.calendarButton.classList.add('opacity-50', 'cursor-not-allowed');
        this.closeDropdown();
    }
}
        
        
        
        
        
        
        
        
        

        // Inicialização dos componentes quando o DOM estiver pronto
        document.addEventListener('DOMContentLoaded', function() {
            const today = new Date();
            const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate()); // 100 anos atrás
            const maxDate = new Date(today.getFullYear() + 10, today.getMonth(), today.getDate()); // 10 anos no futuro

            // Data de Nascimento (com limites razoáveis)
            const birthDatePicker = new SmartDatePicker({
                container: '#birthDatePicker',
                placeholder: 'DD/MM/AAAA',
                minDate: new Date(1900, 0, 1),
                maxDate: today,
                onSelect: updateSelectedDates
            });

            // Data de Início (sem restrições)
            const startDatePicker = new SmartDatePicker({
                container: '#startDatePicker',
                placeholder: 'Selecione a data de início...',
                onSelect: updateSelectedDates
            });

            // Data Futura (mínimo hoje)
            const futureDatePicker = new SmartDatePicker({
                container: '#futureDatePicker',
                placeholder: 'Data futura...',
                minDate: today,
                onSelect: updateSelectedDates
            });

            // Data Passada (máximo hoje)
            const pastDatePicker = new SmartDatePicker({
                container: '#pastDatePicker',
                placeholder: 'Data passada...',
                maxDate: today,
                onSelect: updateSelectedDates
            });

            function updateSelectedDates() {
                const selectedDatesDiv = document.getElementById('selectedDates');
                const dates = [
                    { label: 'Data de Nascimento', picker: birthDatePicker },
                    { label: 'Data de Início', picker: startDatePicker },
                    { label: 'Data Futura', picker: futureDatePicker },
                    { label: 'Data Passada', picker: pastDatePicker }
                ];

                const hasSelections = dates.some(item => item.picker.getValue());

                if (!hasSelections) {
                    selectedDatesDiv.innerHTML = `
                        <div class="text-center py-6">
                            <i class="fas fa-calendar-day text-3xl text-gray-300 dark:text-gray-600 mb-3"></i>
                            <p class="text-gray-500 dark:text-gray-400">Nenhuma data selecionada</p>
                        </div>
                    `;
                    return;
                }

                selectedDatesDiv.innerHTML = dates
                    .filter(item => item.picker.getValue())
                    .map(item => {
                        const date = item.picker.getValue();
                        const formatted = date.toLocaleDateString('pt-BR');
                        const day = date.getDate();
                        const month = date.getMonth() + 1;
                        const year = date.getFullYear();
                        
                        return `
                            <div class="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                                <h4 class="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                                    <i class="fas fa-calendar-check text-green-500 mr-2"></i>
                                    ${item.label}
                                </h4>
                                <div class="flex items-center justify-between">
                                    <span class="text-lg font-mono text-blue-600 dark:text-blue-400">
                                        ${formatted}
                                    </span>
                                    <div class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                                        ${day}/${month}/${year}
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('');
            }

            // Expor para demonstração
            window.datePickers = {
                birthDatePicker,
                startDatePicker,
                futureDatePicker,
                pastDatePicker,
                setExampleDates: function() {
                    birthDatePicker.setValue(new Date(1990, 7, 15)); // 15/08/1990
                    startDatePicker.setValue(new Date(2024, 0, 1)); // 01/01/2024
                    futureDatePicker.setValue(new Date(2024, 11, 31)); // 31/12/2024
                    updateSelectedDates();
                },
                clearAll: function() {
                    birthDatePicker.clear();
                    startDatePicker.clear();
                    futureDatePicker.clear();
                    pastDatePicker.clear();
                    updateSelectedDates();
                }
            };
        });   

        // Botões de exemplo
        document.addEventListener('DOMContentLoaded', function() {
            const demoControls = document.createElement('div');
            demoControls.className = 'fixed bottom-4 right-4 flex space-x-2 z-40';
            demoControls.innerHTML = `
                <button onclick="window.datePickers.setExampleDates()" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg transition-colors duration-200 text-sm font-medium flex items-center">
                    <i class="fas fa-magic mr-2"></i>
                    Exemplo
                </button>
                <button onclick="window.datePickers.clearAll()" class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg shadow-lg transition-colors duration-200 text-sm font-medium flex items-center">
                    <i class="fas fa-broom mr-2"></i>
                    Limpar
                </button>
            `;
            document.body.appendChild(demoControls);
        });                            