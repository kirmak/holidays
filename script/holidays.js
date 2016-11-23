var holidays = (function() {

    var oneDay = 86400000; //milliseconds
    
    function isDate(arg) {
        return Object.prototype.toString.call(arg) === '[object Date]';
    };
    
    function ExactDate(date, month, name) {
        return {
            name: name,
            getDate: function(year) {
                return new Date(Date.UTC(year, month - 1, date));
            }
        }
    }

    function NearestDate(date, month, name) {
        return {
            name: name,
            getDate: function(year) {
                var holiday = new Date(Date.UTC(year, month - 1, date));
                
                var day = holiday.getDay();
                if (day == 0)
                    return new Date(holiday.valueOf() + oneDay);
                    
                if (day == 6)
                    return new Date(holiday.valueOf() - oneDay);
                    
                return holiday;
            }
        }
    }
    
    function NthDayOfWeek(week, day, month, name) {
        return {
            name: name,
            getDate: function(year) {
                var date = new Date(Date.UTC(year, month - 1, 1));
                var firstDay = date.getDay();
                
                var diff = day - firstDay;
                if (diff < 0) diff += 7;
                
                return new Date(date.valueOf() + (diff + (week - 1) * 7) * oneDay);
            }
        }
    }
    
    var defaultConfig = [
        NearestDate(1, 1, 'New Year\'s Day'),
        NthDayOfWeek(3, 1, 1, 'Birthday of Martin Luther King, Jr.'),
        NthDayOfWeek(3, 1, 2, 'Washington\'s Birthday'),
        NthDayOfWeek(4, 1, 5, 'Memorial Day'),
        NearestDate(4, 7, 'Independence Day'),
        NthDayOfWeek(1, 1, 9, 'Labor Day'),
        NthDayOfWeek(2, 1, 10, 'Columbus Day'),
        NearestDate(11, 11, 'Veterans Day'),
        NthDayOfWeek(4, 4, 11, 'Thanksgiving'),
        NthDayOfWeek(4, 5, 11, 'Day after Thanksgiving'),
        NearestDate(25, 12, 'Christmas Day')
    ];
    
    var config = defaultConfig;
    
    var cache = [];
    
    return {
        getHolidays: function(from, to) {
            if (!isDate(to)) to = new Date(to);                
            if (!isDate(from)) from = new Date(from);            
            dateTo = new Date(Math.floor(Math.max(from, to) / oneDay) * oneDay);
            dateFrom = new Date(Math.floor(Math.min(from, to) / oneDay) * oneDay);
                        
            var result = [];                
            for (var i = dateFrom.getFullYear(); i <= dateTo.getFullYear(); i++) {
                if (!cache[i]) {
                    cache[i] = [];
                    for (var j = 0; j < config.length; j++) {
                        cache[i].push(config[j].getDate(i));
                    }
                }                
                for (var j = 0; j < cache[i].length; j++) {
                    if (cache[i][j] >= dateFrom && cache[i][j] <= dateTo) {
                        result.push(cache[i][j]);
                    }
                }
            }            
            return result;
        },
        clearCache: function() {
            cache = [];
        },
        setup: function() {
            config = [];
            return {
                exactDate: function(date, month, name) {
                    config.push(ExactDate(date, month, name));
                    return this;
                },
                nearestDate: function(date, month, name) {
                    config.push(NearestDate(date, month, name));
                    return this;
                },
                nthDayOfWeek: function(week, day, month, name) {
                    config.push(NthDayOfWeek(week, day, month, name));
                    return this;
                }
            }
        },
        reset: function() {
            clearCache();
            config = defaultConfig;
        }
    };
}());